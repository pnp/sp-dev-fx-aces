export interface ISubmitQuestionProps {
    question: string;
    category: string;
}
export declare const useSubmitQuestion: (context: any, siteUrl: string, listName: string) => {
    submitQuestion: ({ question, category }: ISubmitQuestionProps) => Promise<void>;
    loading: boolean;
    error: string | null;
    success: boolean;
    resetStatus: () => void;
};
//# sourceMappingURL=useSubmitQuestion.d.ts.map