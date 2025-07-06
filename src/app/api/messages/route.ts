// app/api/messages/route.ts
import { createClient } from '../../../../utils/supabase/server';

export async function GET(req: Request) {
    
    // const supabase = await createClient()
    // const { searchParams } = new URL(req.url);

    // const { data, error } = await supabase
    //     .from('messages')
    //     .select('*')
    //     .order('created_at', { ascending: true });

    // // if (error) return NextResponse.json({ error }, { status: 500 });
    // return NextResponse.json(data);
}

export async function POST(req: Request) {
    // const body = await req.json();
    // const { listing_id, buyer_email, seller_email, message } = body;

    // const { data, error } = await supabase.from('messages').insert([
    //     {
    //         buyer_email,
    //         seller_email,
    //         message,
    //     },
    // ]).select(); // important: select to return inserted data

    // if (error || !data || data.length === 0) {
    //     return NextResponse.json({ error: error?.message || 'Insert failed' }, { status: 500 });
    // }

    // return NextResponse.json(data[0]); // safe now
}
