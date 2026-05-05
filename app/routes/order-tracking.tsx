import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { orderDetailQuery } from "~/queries/orders";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export function meta() {
  return [{ title: "Track Order — yellowbirds" }];
}

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery(orderDetailQuery(id!));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) return <div className="container mx-auto px-4 py-16 text-center">Order not found.</div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
      <p className="text-muted-foreground mb-8">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

      {/* Progress tracker */}
      <div className="flex items-center mb-10">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              i <= currentStep
                ? "bg-yellow-500 border-yellow-500 text-black"
                : "border-border text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <p className={`hidden sm:block text-[10px] font-medium mt-1 absolute translate-x-[-50%] ${
              i <= currentStep ? "text-foreground" : "text-muted-foreground"
            }`} style={{ marginTop: "2.5rem" }}>
              {step}
            </p>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? "bg-yellow-500" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-3 p-3 rounded-lg border bg-card">
            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover border" />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
            </div>
            <p className="font-semibold text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-t mt-6 pt-4 flex justify-between font-bold">
        <span>Total</span>
        <span>${order.totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
}
