"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
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
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export function ChartBarInteractive({ donations }: { donations: any[] }) {
    const [timeRange, setTimeRange] = React.useState("7days");

    const filteredData = React.useMemo(() => {
        const now = new Date();
        let startDate = new Date();

        if (timeRange === "1day") {
            startDate = new Date(now.setDate(now.getDate() - 1));
        } else if (timeRange === "7days") {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (timeRange === "30days") {
            startDate = new Date(now.setDate(now.getDate() - 30));
        }

        return donations
            .filter((d) => new Date(d.paidAt) >= startDate)
            .reduce((acc: any[], curr) => {
                const date = new Date(curr.paidAt).toISOString().split("T")[0];
                const existing = acc.find((item) => item.date === date);

                if (existing) {
                    existing.amount += curr.amount / 100;
                } else {
                    acc.push({ date, amount: curr.amount / 100 });
                }

                return acc;
            }, [])
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );
    }, [donations, timeRange]);

    const total = React.useMemo(() => {
        return filteredData.reduce((acc, curr) => acc + curr.amount, 0);
    }, [filteredData]);

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
                    <CardTitle>Donation Trends</CardTitle>
                    <CardDescription>
                        Showing total donations over time
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2 px-6 py-4">
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
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <div className="mb-4">
                    <span className="text-2xl font-bold">
                        KES {total.toLocaleString()}
                    </span>
                    <p className="text-xs text-muted-foreground">
                        Total donations in selected period
                    </p>
                </div>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        data={filteredData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    labelFormatter={(value) => {
                                        return new Date(
                                            value
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                    }}
                                />
                            }
                        />
                        <Bar dataKey="amount" fill="var(--chart-2)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
