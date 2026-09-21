import { UserSettingsForm } from "@/features/components/user-settings-form";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and account information.
        </p>
      </div>
      <UserSettingsForm />
    </div>
  );
}
