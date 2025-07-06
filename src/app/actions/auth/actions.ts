'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/server'


interface LoginProps {
    email: string;
    password: string;
}

export async function login({
    email,
    password,
}: LoginProps): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login failed:', error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}



export async function signup({ email, password }: LoginProps): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Signup failed:', error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
}