"use client";
import * as React from "react";
import { LabelList, Pie, PieChart } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    amount: {
        label: "Amount",
    },
    card: {
        label: "Card",
        color: "var(--chart-1)",
    },
    mobile_money: {
        label: "Mobile Money",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function ChartPieLabelList({ donations }: { donations: any[] }) {
    const [timeRange, setTimeRange] = React.useState("30days");

    const chartData = React.useMemo(() => {
        const now = new Date();
        let startDate = new Date();

        if (timeRange === "1day") {
            startDate = new Date(now.setDate(now.getDate() - 1));
        } else if (timeRange === "7days") {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (timeRange === "30days") {
            startDate = new Date(now.setDate(now.getDate() - 30));
        }

        const filtered = donations.filter(
            (d) => new Date(d.paidAt) >= startDate
        );

        const grouped = filtered.reduce(
            (acc: any, curr) => {
                const method = curr.method;
                acc[method] = (acc[method] || 0) + curr.amount / 100;
                return acc;
            },
            { card: 0, mobile_money: 0 }
        );

        return [
            {
                method: "card",
                amount: grouped.card,
                fill: "var(--chart-1)",
            },
            {
                method: "mobile_money",
                amount: grouped.mobile_money,
                fill: "var(--chart-2)",
            },
        ];
    }, [donations, timeRange]);

    const totalAmount = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.amount, 0);
    }, [chartData]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution by payment type</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="mb-4 flex justify-center">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1day">Last 24 Hours</SelectItem>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    nameKey="amount"
                                    hideLabel
                                    formatter={(value) =>
                                        `KES ${Number(value).toLocaleString()}`
                                    }
                                />
                            }
                        />
                        <Pie data={chartData} dataKey="amount">
                            <LabelList
                                dataKey="method"
                                className="fill-background"
                                stroke="none"
                                fontSize={12}
                                formatter={(value: keyof typeof chartConfig) =>
                                    chartConfig[value]?.label
                                }
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none font-medium">
                    Total: KES {totalAmount.toLocaleString()}
                </div>
                <div className="text-muted-foreground leading-none">
                    Payment method distribution
                </div>
            </CardFooter>
        </Card>
    );
}
