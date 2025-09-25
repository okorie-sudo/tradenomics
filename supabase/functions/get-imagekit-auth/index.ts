import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import ImageKit from "https://esm.sh/imagekit@4.1.1";

const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
);

const imagekit = new ImageKit({
    publicKey: Deno.env.get("IMAGEKIT_PUBLIC_KEY") ?? "",
    privateKey: Deno.env.get("IMAGEKIT_PRIVATE_KEY") ?? "",
    urlEndpoint: Deno.env.get("IMAGEKIT_URL_ENDPOINT") ?? "",
});

serve(async (req) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return new Response(JSON.stringify({ error: "No auth header" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { data: { user }, error } = await supabase.auth.getUser(
        authHeader.replace("Bearer ", ""),
    );

    if (error || !user) {
        return new Response(
            JSON.stringify({ error: "Invalid or missing user" }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const token = imagekit.getAuthenticationParameters().token;
    const expire = Math.floor(Date.now() / 1000) + 60 * 10; // 10 min expiry
    const userId = user.id; // Supabase user ID (UUID)

    return new Response(
        JSON.stringify({
            token,
            expire,
            userId,
            signature: imagekit.getAuthenticationParameters().signature,
        }),
        {
            headers: { "Content-Type": "application/json" },
            status: 200,
        },
    );
});
