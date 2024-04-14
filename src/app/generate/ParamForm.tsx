/**
 * This component will contain the form to input the parameters for the haiku generation.
 * It will contain the following fields:
 * - Temperature: a number input field with a default value of 0.9, values between 0 and 1
 * - topK: a integer input field with a default value of 3, values between 1 and 5
 * - topP: a number input field with a default value of 0.8, values between 0 and 1
 */

import { GenerateParamSchema, GenHaikuParameters } from "@/utils/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type GenParamFormProps = {
  handleGenHaikuClick: (options: Omit<GenHaikuParameters, "topic">) => void;
};

export const GenParamForm = ({ handleGenHaikuClick }: GenParamFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenHaikuParameters>({
    resolver: zodResolver(GenerateParamSchema),
    defaultValues: {
      temperature: 0.9,
      topK: 3,
      topP: 0.8,
    },
  });
  const onSubmit: SubmitHandler<GenHaikuParameters> = (data) => {
    console.log(`On submit handler\n${data}`);
    handleGenHaikuClick({
      topK: data.topK,
      topP: data.topP,
      temperature: data.temperature,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mr-4 grid grid-cols-1 gap-2 p-2">
        <label>Temperature:</label>
        <input
          type="number"
          step="0.05"
          className="text-gray-700"
          {...register("temperature", { valueAsNumber: true })}
        />
        <label>topK:</label>
        <input
          className="text-gray-700"
          type="number"
          step="1"
          max="6"
          min="1"
          {...register("topK", { valueAsNumber: true })}
        />
        <label>topP:</label>
        <input
          className="text-gray-700"
          type="number"
          step="0.01"
          max="1"
          min="0.2"
          {...register("topP", { valueAsNumber: true })}
        />
        <input type="hidden" value="placeholder" {...register("topic")} />

        <button
          type="submit"
          className="my-4 rounded-lg bg-orange-400 p-2 shadow-sm dark:bg-blue-600"
        >
          Generate Haiku
        </button>
        {errors && (
          <div className="text-red-500">
            {errors.temperature?.message}
            {errors.topK?.message}
            {errors.topP?.message}
            {errors.topic?.message}
          </div>
        )}
      </div>
    </form>
  );
};
