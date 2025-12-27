import { AIForm } from './ai-form';

export default function OptimizePage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI-Powered Delivery Optimization</h1>
        <p className="text-muted-foreground">
          Analyze your email content and recipient data to get AI-driven recommendations for better engagement and deliverability.
        </p>
      </div>
      <AIForm />
    </div>
  );
}
