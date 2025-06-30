export const NORMAL_STAGE = 0;
export const LAST_MAIN_STAGE = 1;
export const LAST_INTER_STAGE = 2;
export const FIRST_INTER_STAGE = 3;
export const CONTINUE_STAGE = 4;

export async function pause(type?: 0 | 1 | 2 | 3 | 4): Promise<void>;
