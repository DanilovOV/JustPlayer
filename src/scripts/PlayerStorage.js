import songsMetaData from "./metadata"

export default class PlayerStorage {

    static get order() {
        let orderString = localStorage.getItem('playlist')

        if (orderString) {
            const order = orderString.split(',')
            return order.length > songsMetaData.length
                ? this.resetAndUploadOrder()
                : order
        } else {
            return this.resetAndUploadOrder()
        }
    }

    static getAndUploadNewOrder(songsList) {
        let newOrder = songsList.map(song => song.dataset.songId)
        
        this.uploadSongsOrder(newOrder)
        return newOrder
    }

    static resetAndUploadOrder() {
        let resetOrder = []
        for (let i = 0; i < songsMetaData.length; i++) resetOrder[i] = i

        this.uploadSongsOrder(resetOrder)
        return resetOrder
    }

    static uploadSongsOrder(order) {
        localStorage.removeItem('playlist')
        localStorage.setItem('playlist', order)
    }    
}