import {BubbleDataPoint, Chart, ChartTypeRegistry, Point} from "chart.js";

export type GenerateLabelsTypes =
    {
        data:
            {
                labels: any[],
                datasets:
                    {
                        backgroundColor:
                            {
                                [x: string]: any,
                            }
                    }[]
            };
    }


    // Chart<keyof ChartTypeRegistry, (number | Point | [number, number] | BubbleDataPoint | null)[], unknown>
