export type TokensType = {
    accessToken: string | null,
    refreshToken: string | null,
    userInfo: UserInfoType,
}

export type UserInfoType = {
    id: number,
    name: string,
    lastName: string,
}