import {GenerateLabelsTypes} from "./chartjs/generateLabels.types";

export type GenerateLabelsType =
    {
    datasetIndex: number,
    index: number,
    text: string[],
    fillStyle: {[p: string]: string},
    strokeStyle: {[p: string]: string},
}