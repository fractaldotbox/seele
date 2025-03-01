export interface PriceResponse {
	coins: {
		[key: string]: {
			price: number;
			timestamp: number;
		};
	};
}

export interface BatchPriceResponse {
	coins: {
		[key: string]: {
			prices: [number, number][]; // [timestamp, price][]
			symbol: string;
		};
	};
}
