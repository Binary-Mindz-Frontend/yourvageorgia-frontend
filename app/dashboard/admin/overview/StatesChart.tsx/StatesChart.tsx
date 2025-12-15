// "use client";

// import React from "react";

// import { ChevronDown, Filter } from "lucide-react";
// import SalesChart from "../_components/chart/SalesChart";
// import TopCategories from "../_components/chart/TopCategories";
// import RevenueChart from "../_components/chart/RevenueChart";
// import ServiceChart from "../_components/chart/ServiceChart";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// const salesData = [
// 	{ name: "5k", value: 20 },
// 	{ name: "6k", value: 25 },
// 	{ name: "7k", value: 30 },
// 	{ name: "8k", value: 32 },
// 	{ name: "9k", value: 48 },
// 	{ name: "10k", value: 50 },
// 	{ name: "11k", value: 42 },
// 	{ name: "12k", value: 52 },
// 	{ name: "13k", value: 48 },
// 	{ name: "14k", value: 55 },
// 	{ name: "15k", value: 32 },
// 	{ name: "16k", value: 38 },
// 	{ name: "17k", value: 42 },
// 	{ name: "18k", value: 52 },
// 	{ name: "19k", value: 48 },
// 	{ name: "20k", value: 95 },
// 	{ name: "21k", value: 35 },
// 	{ name: "22k", value: 52 },
// 	{ name: "23k", value: 48 },
// 	{ name: "24k", value: 50 },
// 	{ name: "25k", value: 45 },
// 	{ name: "26k", value: 52 },
// 	{ name: "27k", value: 42 },
// 	{ name: "28k", value: 55 },
// 	{ name: "29k", value: 48 },
// 	{ name: "30k", value: 42 },
// 	{ name: "31k", value: 52 },
// 	{ name: "32k", value: 48 },
// 	{ name: "33k", value: 62 },
// 	{ name: "34k", value: 55 },
// 	{ name: "35k", value: 25 },
// 	{ name: "36k", value: 32 },
// 	{ name: "37k", value: 28 },
// 	{ name: "38k", value: 48 },
// 	{ name: "39k", value: 50 },
// 	{ name: "40k", value: 52 },
// 	{ name: "41k", value: 48 },
// 	{ name: "42k", value: 45 },
// 	{ name: "43k", value: 75 },
// 	{ name: "44k", value: 72 },
// 	{ name: "45k", value: 62 },
// 	{ name: "46k", value: 68 },
// 	{ name: "47k", value: 65 },
// 	{ name: "48k", value: 60 },
// 	{ name: "49k", value: 58 },
// 	{ name: "50k", value: 55 },
// 	{ name: "51k", value: 57 },
// 	{ name: "52k", value: 55 },
// 	{ name: "53k", value: 45 },
// 	{ name: "54k", value: 42 },
// 	{ name: "55k", value: 55 },
// 	{ name: "56k", value: 52 },
// 	{ name: "57k", value: 57 },
// 	{ name: "58k", value: 55 },
// 	{ name: "59k", value: 52 },
// 	{ name: "60k", value: 55 },
// ];

// const sampleCategories = [
// 	{ name: "Home Improvement", jobs: 200, percentage: 66 },
// 	{ name: "Cleaning Services", jobs: 300, percentage: 100 },
// 	{ name: "Health & Wellness", jobs: 100, percentage: 33 },
// 	{ name: "Events & Entertainment", jobs: 80, percentage: 26 },
// 	{ name: "Education & Training", jobs: 200, percentage: 66 },
// ];

// const StatesChart = () => {
// 	return (
// 		<div className="space-y-6 mt-2 bg-black text-white min-h-screen p-4">
// 			<div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
// 				<div className="lg:col-span-2 space-y-7.5">
// 					<div className="flex justify-between items-center mb-5 flex-wrap bg-[#1a1a1a] py-3 px-4 rounded-lg">
// 						<div className="relative w-full sm:w-auto flex items-center space-x-2">
// 							<Filter size={40} className="text-white" />
// 							<span className="text-white font-medium text-lg">Filters:</span>

// 							<Select defaultValue="today">
// 								<SelectTrigger
// 									className="
// 										w-full sm:min-w-[140px]
// 										pl-4 pr-10 py-2.5
// 										bg-gray-800
// 										border-0
// 										rounded-lg
// 										text-sm text-white
// 										cursor-pointer
// 										focus:outline-none
// 										focus:ring-0
// 										focus-visible:ring-0
// 										focus-visible:ring-offset-0
// 										[&>svg]:hidden
// 									"
// 									>
// 									<SelectValue placeholder="Today" />
// 								</SelectTrigger>

// 								<SelectContent className="bg-[#1a1a1a] border-none shadow-lg rounded-md text-white">
// 									<SelectItem value="today">Today</SelectItem>
// 									<SelectItem value="week">This Week</SelectItem>
// 									<SelectItem value="month">This Month</SelectItem>
// 								</SelectContent>
// 							</Select>

// 							<ChevronDown
// 								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
// 								size={16}
// 							/>
// 						</div>
// 					</div>

// 					<SalesChart title="Sales Details" data={salesData} showDateFilter={true} />

// 					<RevenueChart data={[]} />
// 				</div>

// 				<div className="lg:col-span-1 space-y-5 flex flex-col lg:justify-end">
// 					<TopCategories categories={sampleCategories} totalCategories={12} />
// 					<ServiceChart data={[]} />
// 				</div>

// 			</div>


// 		</div>
// 	);
// };

// export default StatesChart;