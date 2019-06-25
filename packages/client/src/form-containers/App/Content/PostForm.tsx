import { withFormik, WithFormikConfig } from "formik";
import * as Yup from "yup";

import { IFormValues, PostForm } from "@app/components/App/Content/PostForm";
import { FetchLevel } from "@app/types/main";
import { PostRules } from "@app/validator-rules";

interface IFormProps {
    onSubmit: (v: IFormValues) => void;
    onComplete: () => void;
    onFatalError: (err: string) => void;

    mutatePostErrors: {
        [key: string]: string;
    };
    mutatePostLevel: FetchLevel;
    defaultFormValues?: IFormValues;
}

const config: WithFormikConfig<IFormProps, IFormValues> = {
    handleSubmit: async (values, { props }) => {
        const { onSubmit } = props;

        onSubmit(values);
    },
    mapPropsToValues: ({ defaultFormValues }: IFormProps) => {
        if (typeof defaultFormValues !== "undefined") {
            return defaultFormValues;
        }

        return {
            body: "",
            slug: "",
            summary: "",
            title: "",
        };
    },
    validationSchema: Yup.object().shape({
        body: PostRules.body,
        slug: PostRules.slug,
        summary: PostRules.summary,
        title: PostRules.title,
    }),
};

export const PostFormFormContainer = withFormik(config)(PostForm);
