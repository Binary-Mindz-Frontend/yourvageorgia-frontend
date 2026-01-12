import AccessCodePage from "./_components/AccessCodeTable/AccessCodeTable";

export default function page() {
    return (
        <div className="bg-black p-5">
            <p className="text-base font-medium text-white sm:pt-8">Analytics Overview</p>

            <AccessCodePage />
        </div>
    );
}
