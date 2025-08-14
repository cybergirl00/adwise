'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Building, Calendar } from 'lucide-react';
import { Dialog,DialogContent,DialogDescription,DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useUser } from '@clerk/nextjs';
import { fundWallet, getUserTransactions } from '@/actions/wallet.actions';
// import { toast} from '@/components/ui/sonner'

export default function WalletPage() {
  const [fundAmount, setFundAmount] = useState('');
  const [showFundForm, setShowFundForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  const { user } = useUser();


  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: fundAmount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.emailAddresses[0].emailAddress,
      //  phone_number: '070********',
      name: user?.firstName + " " + user?.lastName,
    },
    // customizations: {
    //   title: 'my Payment Title',
    //   description: 'Payment for items in cart',
    //   logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    // },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const balance = 125000;
  const pendingPayments = 43000;

  const handleFundWallet = () => {
    if (fundAmount) {
      // Handle wallet funding logic

      handleFlutterPayment({
            callback: async  (response) => {

              const res = await fundWallet({
                clerkId: user?.id ?? "",
                amount: Number(fundAmount)
              });

              if(res?.status === 200) {
                  setFundAmount('');
      setShowFundForm(false);
               console.log(response);
              }else {
                console.error(`Error Occured while funding wallet`)
              }
                closePaymentModal() 
            },
            onClose: () => {},
          });
      
    }
  };

  useEffect(() => {
   const AllTransactions = async () => {
    setIsLoading(true);

    try {
      const data = await getUserTransactions({
        clerkId: user?.id ?? ""
      }); 
      setTransactions(data?.data.transactions)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
   }

   AllTransactions();
  }, [])
  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground mt-2">Manage your funds and payment history</p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary to-primary/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="h-8 w-8 text-primary-foreground" />
              <Badge className="bg-background/20 text-primary-foreground">Available</Badge>
            </div>
            <div>
              <p className="text-primary-foreground/80 text-sm">Current Balance</p>
              <p className="text-3xl font-bold text-primary-foreground">₦{balance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center dark:bg-yellow-900">
                <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Pending Payments</p>
              <p className="text-2xl font-bold">₦{pendingPayments.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center dark:bg-primary/20">
                <ArrowUpRight className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline">This Month</Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Spent</p>
              <p className="text-2xl font-bold">₦93,000</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        
        <Button
          onClick={() => setShowFundForm(!showFundForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Fund Wallet
        </Button>
        <Button variant="outline">
          <Building className="h-4 w-4 mr-2" />
          Connect Bank Account
        </Button>
      </div>

      {/* Fund Wallet Form */}
      {showFundForm && (
        <Card>
          <CardHeader>
            <CardTitle>Fund Your Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="50000"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Card
                  </Button>
                  
                  <Button variant="outline" className="justify-start" 
                  
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Bank
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowFundForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleFundWallet}
                disabled={!fundAmount}
              >
                Fund Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions && transactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 1
                        ? 'bg-green-100 dark:bg-green-900/50'
                        : 'bg-red-100 dark:bg-red-900/50'
                    }`}>
                      {transaction.type === 1 ? (
                        <ArrowDownLeft className={`h-5 w-5 ${
                          transaction.type === 1
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`} />
                      ) : (
                        <ArrowUpRight className={`h-5 w-5 ${
                          transaction.type === 1
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.desc}</p>
                      <p className="text-sm text-muted-foreground">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 1
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 1 ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                    >
                      {transaction.status === 1 ? 'completed' : 'failed'}
                    </Badge>
                  </div>
                </div>
                
                {index < transactions.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}