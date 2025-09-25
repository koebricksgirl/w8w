import { useParams } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useFormResponses } from "../hooks/useForms";



export const FormResponses = () => {
    const { formId } = useParams<{ formId: string }>();

    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const { data, error, isLoading } = useFormResponses(formId!);

    if (error) {
        let apiMessage = "Some error has happened";
        if (
            typeof error === "object" &&
            error !== null &&
            "response" in error &&
            (error as any).response?.data?.message
        ) {
            apiMessage = (error as any).response.data.message;
        } else if (error?.message) {
            apiMessage = error.message;
        }
        return (
            <div className={`min-h-[80vh] flex items-center justify-center ${isDark ? "text-white" : "text-black"}`}>
                <div className={`border border-red-400  ${isDark?"bg-zinc-900":"bg-red-50"} rounded p-6 text-center max-w-md w-full`}>
                    <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
                    <div className={`${isDark?"text-white":"text-gray-400"}`}>{apiMessage}</div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className={`min-h-[80vh] flex items-center justify-center ${isDark ? "text-white" : "text-black"}`}>
            <div className={`${isDark?"bg-zinc-900":"bg-red-50"} rounded p-6 text-center max-w-md w-full`}>
                <h2 className="text-xl font-bold mb-2">Loading...</h2>
            </div>
        </div>
    }

    return (
        <div className={`min-h-[80vh] ${isDark ? "text-white" : "text-black"}`}>
            <h2 className="font-bold text-medium text-start ml-52 mt-6">Submitted Responses</h2>
            <div className="flex flex-col justify-center items-center my-4">
                {data?.responses && data.responses.length > 0 ? (
                    data.responses.map((response: any) => (
                        <div key={response.id} className="mb-4 p-4 border rounded w-fit px-4">
                            <div className="text-xs text-gray-400 mb-2">
                                Submitted: {new Date(response.createdAt).toLocaleString()}
                            </div>
                            {Object.entries(response.data).map(([key, value]) => (
                                <div key={key}>
                                    <span className="font-semibold">{key}:</span> {value as any}
                                </div>
                            ))}
                            <div className="my-4">
                                <h4>Extra Details about the user - </h4>
                                <div>Ip : {response.ip}</div>
                                <div>User device info: {response.userAgent}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-zinc-400">No responses found.</div>
                )}
            </div>
        </div>
    );
}