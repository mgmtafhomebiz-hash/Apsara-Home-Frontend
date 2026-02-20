'use client';

import { useMeQuery, useUpdateProfileMutation } from "@/store/api/userApi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { motion } from "framer-motion";

type ProfileFormState = {
    name: string;
    email: string;
    phone: string;
    username: string;
}

const ProfilePage = () => {
  const {data: session} = useSession();
  const { data, isLoading } = useMeQuery();
  const [updateProfie, { isLoading: isSaving}] = useUpdateProfileMutation()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    username: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    setForm({
        name: data?.name ?? session?.user?.name ?? '',
        email: data?.email ?? session?.user?.email ?? '',
        phone: data?.phone ?? '',
        username: data?.username ?? ''
    })

  },[data, session])

  const onChange = (field: keyof ProfileFormState, e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
        ...prev, 
        [field]: e.target.value
    }))
  }

  const handleSave = async () => {
    setMessage('');
    try {
        await updateProfie({
            name: form.name, 
            username: form.username,
            phone: form.phone,
        }).unwrap()
        setMessage('Profile updated successfully')
    } catch (error: any) {
        setMessage(error?.data?.message || 'Failed to update profile');
    }
}

if (isLoading) {
    <div className="min-h-[55vh] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-5 py-3 bg-white shadow-sm">
            <Loading size={18} className="border border-gray-300 border-t-orange-500"/>
            <span>Loading your profile...</span>
        </div>
    </div>
}

  return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-b from-orange-50/60 via-white to-white"
        >
            <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-orange-200/35 blur-3xl"/>
            <div className="pointer-events-none absolute -top-16 right-0 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl"/>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 md:mb-8">
                    <p className="text-xs font-semibold tracking-[0.24em] text-orange-500 uppercase">Account Center</p>
                    <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900">My Profile</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your account details and security settings.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                    <aside className="xl:col-span-4 space-y-5">
                        <div className="rounded-2xl border border-orange-100 bg-white shadow-[0_10px_35px_-20px_rgba(249,115,22,0.6)] p-5">
                            <h2 className="text-lg font-bold text-gray-900">{form.name || 'AF Home User'}</h2>
                            <p className="text-sm text-gray-500">{form.email || 'No email yet'}</p>
                        </div>

                       <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <h3 className="text-sm font-bold text-gray-800">Quick Actions</h3>
                        <div className="mt-3 space-y-2">
                            <button className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-orange-600 text-sm font-medium text-gray-700 transition-colors">
                                View Orders
                            </button>
                            <button className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-orange-600 text-sm font-medium text-gray-700 transition-colors">
                                Saved Wishlist
                            </button>
                        </div>
                       </div>
                    </aside>

                    <div className="xl:col-span-8 space-y-5">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
                            <div className="flex items-center justify-between gap-3 mb-5">
                                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">
                                    Editable
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                                    <input type="text" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div />
        </motion.section>
    )
}

export default ProfilePage
