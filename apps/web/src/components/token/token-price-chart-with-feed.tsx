import type { TokenPriceEntry } from "@/lib/domain/token/token-price-entry";
import { format, isSameHour } from "date-fns";
import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import { type Address, type Chain, ChainDisconnectedError } from "viem";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { type TokenInfo, useTokenInfoBulk } from "./token";
import { TokenChipWithInfo } from "./token-chip-with-info";

// Alternatively s3 scale
// https://github.com/recharts/recharts/blob/master/storybook/stories/Examples/TimeSeries.stories.tsx#L97

const filterIntegralTicks = (ticks: string[]) => {
  return ticks.filter((tick, index, array) => {
    if (index === 0 || index === array.length - 1) {
      return true;
    }
    const prevTick = array[index - 1];
    const nextTick = array[index + 1];
    const tickDate = new Date(tick);
    const prevTickDate = new Date(prevTick);
    const nextTickDate = new Date(nextTick);

    return (
      !isSameHour(tickDate, prevTickDate) && !isSameHour(tickDate, nextTickDate)
    );
  });
};

export const TokenPriceChartWithFeed = ({
  tokenPriceFeedByTokenId,
  tokenInfoByTokenId,
}: {
  tokenPriceFeedByTokenId: { [tokenId: string]: TokenPriceEntry[] };
  tokenInfoByTokenId: Record<string, TokenInfo>;
}) => {
  const tokenIds = Object.keys(tokenPriceFeedByTokenId || {});

  console.log({ tokenPriceFeedByTokenId });

  const chartData = Object.values(
    Object.entries(tokenPriceFeedByTokenId || {}).reduce(
      (acc: Record<string, Record<string, number>>, [tokenId, entries]) => {
        // biome-ignore lint/complexity/noForEach: <explanation>
        entries.forEach((entry) => {
          const date = format(
            new Date(entry.happenAt! * 1000),
            "yyyy-MM-dd HH:MM",
          );

          if (!acc[date]) {
            acc[date] = { date: new Date(date).getTime() };
          }
          acc[date][tokenId] = entry.price ?? 0;
        });
        return acc;
      },
      {},
    ),
  );

  const chartConfig = Object.keys(tokenPriceFeedByTokenId).reduce(
    (acc: Record<string, TokenInfo & { label: string }>, tokenId) => {
      const tokenInfo = tokenInfoByTokenId[tokenId] || {};
      acc[tokenId] = {
        ...tokenInfo,
        label: tokenInfo?.symbol,
      };
      return acc;
    },
    {},
  ) satisfies ChartConfig;

  return (
    <div className="w-full h-full]">
      <ChartContainer
        config={chartConfig}
        style={{ height: "300px", width: "300px" }}
      >
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            // ticks={filterIntegralTicks([chartData.map(d => d.date)])}
            tickFormatter={(value) => {
              const date = new Date(value);

              return format(date, "MM-dd");
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(v, tokenId) => {
                  const decimals = 18;
                  const value = BigInt(
                    Math.floor((v as number) * 10 ** decimals),
                  );
                  const tokenInfo = chartConfig[tokenId]! || {};

                  const { label, imageUrl = "" } = tokenInfo;
                  return (
                    <TokenChipWithInfo
                      isShowValue
                      imageUrl={imageUrl}
                      name={label}
                      symbol={label}
                      decimals={decimals}
                      value={value}
                    />
                  );
                }}
                hideLabel
              />
            }
          />
          {tokenIds.map((dataKey, i) => {
            return (
              <Line
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                dataKey={dataKey}
                type="monotone"
                stroke={`hsl(${Math.random() * 360}, 100%, 50%)`}
                strokeWidth={2}
                dot={false}
                strokeOpacity={0.5}
              />
            );
          })}
        </LineChart>
      </ChartContainer>
    </div>
  );
};
