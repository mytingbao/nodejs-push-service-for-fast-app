import { reactive } from "vue";
interface ParamsType {
  key: string;
  value?: string;
}

export function useActionQuery() {
  const paramsData: Array<ParamsType> = reactive([
    {
      key: "",
      value: ""
    }
  ]);
  const addParams = (): void => {
    const param: ParamsType = {
      key: "",
      value: ""
    };
    paramsData.push(param);
  };
  const delParams = (index: number): void => {
    paramsData.splice(index, 1);
  };
  const transferArray2String = (): string => {
    const obj = {};
    for (const item of paramsData) {
      if (item.key) {
        obj[item.key] = item.value;
      }
    }
    return JSON.stringify(obj);
  };
  return { paramsData, addParams, delParams, transferArray2String };
}
