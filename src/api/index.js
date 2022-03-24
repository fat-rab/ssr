export function getList() {
    return new Promise((resolve) => {
        resolve([
            {
                id: 1,
                name: 'tom'
            }
        ])
    })
}
