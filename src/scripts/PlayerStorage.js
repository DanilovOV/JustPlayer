import songsMetaData from "./metadata"

export default class PlayerStorage {

    get order() {
        let orderString = localStorage.getItem('playlist')

        if (orderString) {
            const order = orderString.split(',')
            return order.length > songsMetaData.length
                ? this.resetOrder()
                : order
        } else {
            return this.resetOrder()
        }
    }

    newOrder(songsList) {
        let newOrder = []
        songsList.forEach((song, index) => newOrder[index] = song.dataset.songId)
        
        this.uploadSongsOrder(newOrder)
        return newOrder
    }

    resetOrder() {
        let resetOrder = []
        for (let i = 0; i < songsMetaData.length; i++) resetOrder[i] = i

        this.uploadSongsOrder(resetOrder)
        return resetOrder
    }

    uploadSongsOrder(order) {
        localStorage.removeItem('playlist')
        localStorage.setItem('playlist', order)
    }    
}