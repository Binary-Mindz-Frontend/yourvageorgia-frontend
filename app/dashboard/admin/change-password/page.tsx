import ChangePasswordForm from "./_components/ChangePasswordForm";

const ChangePasswordPage = () => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-5 antialiased bg-black">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-3xl lg:text-5xl text-white font-serif font-semibold text-center mb-10 tracking-wider">
                    Change Password
                </h1>

                <ChangePasswordForm />
            </div>
        </div>
    );
};

export default ChangePasswordPage;
