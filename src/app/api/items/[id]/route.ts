// app/api/items/[id]/route.ts

import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const supabase = await createClient()
    const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("public_id", id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
