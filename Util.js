export default {
    /**
     *
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