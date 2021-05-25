export interface records {
    [key: string]: chat
}
export interface chat {
    language_code?: string,
    counters: Array<counter>
}
export interface counter {
    heart?: string,
    overall: number,
    last_occurrence?: number,
    users: {[key: string]: count_of_user} 
}
export interface count_of_user {
    username?: string,
    first_name?: string,
    last_name?: string,
    count: number,
}