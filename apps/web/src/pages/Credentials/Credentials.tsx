import { PlayIcon , Pencil2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useCreateCredential, useCredentials, useDeleteCredential, useUpdateCredential } from "../../hooks/useCredentials";
import { useThemeStore } from "../../store/useThemeStore";
import { nodeIcons } from "../../lib/nodeIcons";
import { useState } from "react";
import type { WorkflowCredential } from "../../types/workflow";
import { CredentialViewBody } from "./CredentialViewBody";
import { CredentialEditBody } from "./CredentialEditBody";
import { Modal } from "./Modal";
import type { Platform } from "@w8w/db";


export default function Credentials() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const { data, isLoading, isError } = useCredentials();
    const createCredential = useCreateCredential();
    const updateCredential = useUpdateCredential();
    const deleteCredential = useDeleteCredential();

    const credentialsList = data?.credentials ?? [];
    const [selectedCredential, setSelectedCredential] = useState<WorkflowCredential | null>(null);
    const [modalType, setModalType] = useState<null | "create" | "view" | "edit" | "delete">(null);


    return (
        <div className="py-32 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="md:flex justify-between items-center font-bold mb-6">
                    <h1 className="flex items-center gap-3 text-3xl font-bold">
                        My Credentials
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="object-contain iconify iconify--fa-solid" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A24 24 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176C160 78.798 238.797.001 335.999 0C433.488-.001 512 78.511 512 176.001M336 128c0 26.51 21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48s-48 21.49-48 48"></path></svg>
                    </h1>
                    <button className={`rounded-lg items-center gap-2 mt-4 md:mt-0 inline-flex px-4 py-2 ${isDark
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}
                        onClick={() => {
                            setSelectedCredential(null);
                            setModalType("create");
                        }}
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add New Credential
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        isLoading && (
                            <div className="col-span-full text-center text-zinc-400">
                                Loading credentials ...
                            </div>
                        )
                    }
                    {
                        isError && (
                            <div className="col-span-full text-center text-red-500">
                                Failed to load credentials.
                            </div>
                        )
                    }

                    {
                        !isLoading && credentialsList.length === 0 && (
                            <div className="col-span-full text-center text-zinc-400">
                                No workflows found.
                            </div>
                        )
                    }
                    {credentialsList.map((credential) => (
                        <div
                            key={credential.id}
                            className={`p-6 rounded-lg border ${isDark ? 'border-zinc-800' : 'border-zinc-200'
                                }`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold mb-1">{credential.title}</h3>
                                    <p className={`flex gap-2 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                                        }`}>{credential.platform} <img src={nodeIcons[credential.platform]} className="w-5 h-5" alt="Platform" />
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className={`p-2 rounded-lg ${isDark
                                            ? 'hover:bg-white/10'
                                            : 'hover:bg-zinc-100'
                                            } transition-colors`}
                                        onClick={() => { setSelectedCredential(credential); setModalType("view"); }}>
                                        <PlayIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => { setSelectedCredential(credential); setModalType("edit") }}
                                        className={`p-2 rounded-lg ${isDark
                                            ? 'hover:bg-white/10'
                                            : 'hover:bg-zinc-100'
                                            } transition-colors`}>
                                        <Pencil2Icon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => { setSelectedCredential(credential); setModalType("delete"); }}
                                        className={`px-3 py-1 rounded text-sm ${isDark
                                            ? 'hover:bg-white/10 text-red-400'
                                            : 'hover:bg-zinc-100 text-red-500'
                                            } transition-colors`}>
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {modalType === "create" && (
                    <Modal onClose={() => setModalType(null)}>
                        <h2>Add New Credential</h2>
                        <CredentialEditBody
                            credential={{
                                title: "",
                                platform: "Telegram" as Platform,
                                data: {},
                                createdAt: new Date().toISOString(),
                            }}
                            onSave={(newCredential) => {
                                createCredential.mutate(
                                    {
                                        title: newCredential.title,
                                        platform: newCredential.platform,
                                        data: newCredential.data
                                    },
                                    {
                                        onSuccess: () => {
                                            setModalType(null)
                                            alert("New Credential added")
                                        }
                                    }
                                )
                            }}
                            onCancel={() => setModalType(null)}
                        />
                    </Modal>
                )}

                {modalType === "view" && selectedCredential && (
                    <Modal onClose={() => setModalType(null)}>
                        <h2>View Credential</h2>
                        <CredentialViewBody credential={selectedCredential} />
                        <button
                            className="mt-6 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => setModalType(null)}>
                            Close
                        </button>
                    </Modal>
                )}

                {modalType === "edit" && selectedCredential && (
                    <Modal onClose={() => setModalType(null)}>
                        <h2>Edit Credential</h2>
                        <CredentialEditBody
                            credential={selectedCredential}
                            onSave={(updated) => {
                                updateCredential.mutate(
                                    {
                                        id: updated.id!,
                                        data: {
                                            title: updated.title,
                                            platform: updated.platform,
                                            data: updated.data,
                                        },
                                    },
                                    {
                                        onSuccess: () => {
                                            setModalType(null);
                                            alert("Credential Edited Successfully")
                                        },
                                    }
                                )
                            }}
                            onCancel={() => setModalType(null)}
                        />
                    </Modal>
                )}


                {modalType === "delete" && selectedCredential && (
                    <Modal onClose={() => setModalType(null)}>
                        <h2 className="font-semibold">Delete Credential</h2>
                        <p className="text-zinc-400 my-4">Would you like to delete this credential?</p>
                        <div className="flex gap-4">
                        <button
                            className="text-white bg-red-500 py-2 px-4 rounded-lg cursor-pointer"
                            onClick={() => {
                                if (!selectedCredential?.id) return;
                                deleteCredential.mutate(selectedCredential.id, {
                                    onSuccess: () => {
                                        setModalType(null);
                                        alert("Credential Deleted")
                                    },
                                });
                            }}
                        >
                            Delete
                        </button>
                        <button className="text-white bg-blue-600 rounded-lg py-2 px-4 cursor-pointer" onClick={() => setModalType(null)}>Cancel</button>
                        </div>
                    </Modal>
                )}
            </div>
        </div>)
}

