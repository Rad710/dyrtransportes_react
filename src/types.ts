export type PropsTitle = {
    title: string;
};

export type PropsUseState<T> = {
    data: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
};
