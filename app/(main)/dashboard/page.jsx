// This is a Server Component now

import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AccountCard from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProgress from "./_components/budget-progress";
import DashboardOverview from "./_components/transaction-overview";

async function DashboardPage() {
    try {
        console.log("Fetching accounts...");
        const accounts = await getUserAccounts();
        console.log("Accounts loaded:", accounts);

        const defaultAccount = accounts?.find((account) => account.isDefault);
        let budgetData = null;

        if (defaultAccount) {
            console.log("Fetching budget...");
            budgetData = await getCurrentBudget(defaultAccount.id);
            console.log("Budget data:", budgetData);
        }

        console.log("Fetching transactions...");
        const transactions = await getDashboardData();
        console.log("Transactions:", transactions);

        return (
            <div className="space-y-8">
                {defaultAccount && (
                    <BudgetProgress
                        initialBudget={budgetData?.budget}
                        currentExpenses={budgetData?.currentExpenses || 0}
                    />
                )}

                <DashboardOverview
                    accounts={accounts}
                    transactions={transactions || []}
                />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <CreateAccountDrawer>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
                            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                                <Plus className="h-10 w-10 mb-2" />
                                <p className="text-sm font-medium">Add New Account</p>
                            </CardContent>
                        </Card>
                    </CreateAccountDrawer>

                    {accounts.length > 0 &&
                        accounts?.map((account) => (
                            <AccountCard key={account.id} account={account} />
                        ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error("🚨 ERROR in DashboardPage:", error);
        // Return a fallback UI so the stream doesn't crash
        return (
            <div>An error occurred loading your dashboard.</div>
        );
    }
}

export default DashboardPage;
