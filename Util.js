module.exports = {
    /**
     * changes the array in place ( no need to use return value)
     * @param element
     * @param array
     * @return {array} modified array
     */
    removeFromArray(array, element){
        let index = array.indexOf(element);
        array.splice(index, 1);
        return array;
    }
}