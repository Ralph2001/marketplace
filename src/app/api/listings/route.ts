import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../libs/supabase";
import slugify from "slugify";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: "Failed to fetch listings." }, { status: 500 });
    }

    const filtered = data.filter((item) => {
        const matchesCategory = categorySlug
            ? slugify(item.category, { lower: true }) === categorySlug
            : true;

        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });
    const paginated = filtered.slice(offset, offset + limit);
    return NextResponse.json(paginated);
}
