'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Building, Calendar } from 'lucide-react';

const transactions = [
  {
    id: '1',
    type: 'credit',
    amount: 25000,
    description: 'Payment to Adebayo Williams - Video Production',
    date: '2024-01-20',
    status: 'completed'
  },
  {
    id: '2',
    type: 'debit',
    amount: 50000,
    description: 'Campaign funding - Summer Collection',
    date: '2024-01-18',
    status: 'completed'
  },
  {
    id: '3',
    type: 'credit',
    amount: 18000,
    description: 'Payment to Kemi Oladele - Graphic Design',
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: '4',
    type: 'debit',
    amount: 75000,
    description: 'Wallet funding via Bank Transfer',
    date: '2024-01-10',
    status: 'completed'
  }
];

export default function WalletPage() {
  const [fundAmount, setFundAmount] = useState('');
  const [showFundForm, setShowFundForm] = useState(false);

  const balance = 125000;
  const pendingPayments = 43000;

  const handleFundWallet = () => {
    if (fundAmount) {
      // Handle wallet funding logic
      setFundAmount('');
      setShowFundForm(false);
    }
  };

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
                  <Button variant="outline" className="justify-start">
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
            {transactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'credit'
                        ? 'bg-green-100 dark:bg-green-900/50'
                        : 'bg-red-100 dark:bg-red-900/50'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className={`h-5 w-5 ${
                          transaction.type === 'credit'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`} />
                      ) : (
                        <ArrowUpRight className={`h-5 w-5 ${
                          transaction.type === 'credit'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'credit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                    </p>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                    >
                      {transaction.status}
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