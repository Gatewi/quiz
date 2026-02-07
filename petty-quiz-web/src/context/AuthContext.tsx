
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import type { Profile } from '../types';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('Error getting session:', error);
                setIsLoading(false);
                return;
            }

            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setIsLoading(false);
            }
        }).catch((err) => {
            console.error('Unexpected error getting session:', err);
            setIsLoading(false);
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state change:', _event, session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string, currentUser?: User) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id_user', userId)
                .single();

            if (error || !data) {
                console.warn('Profile not found, attempting to create one...');
                if (currentUser) {
                    const newProfile: Partial<Profile> = {
                        id_user: currentUser.id,
                        user_email: currentUser.email || '',
                        user_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
                        is_active: true,
                        user_role: 'student',
                        created_at: new Date().toISOString()
                    };

                    const { data: createdProfile, error: createError } = await supabase
                        .from('profiles')
                        .insert([newProfile])
                        .select()
                        .single();

                    if (!createError && createdProfile) {
                        console.log('Profile created successfully');
                        setProfile(createdProfile as Profile);
                    } else {
                        console.error('Error creating profile:', createError);
                    }
                }
            } else {
                setProfile(data as Profile);
            }
        } catch (err) {
            console.error('Unexpected error fetching/creating profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ user, session, profile, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
