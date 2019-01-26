import {Cookies, LocalStorage} from 'quasar'

class Array {

  constructor() {

  }

  /*order array in tree*/
  tree(dataArray) {
    /*recursive funtion*/
    let tree = (parentId) => {
      parentId = parentId ? parentId : 0 //first parent
      let response = []

      //filter and order only by childrens from parentId
      dataArray.filter((item) => {
        item.parentId ? true : item.parentId = 0
        if (item.parentId == parentId) {
          let source = {
            id: item.id,
            label: item.title ? item.title : (item.name ? item.name : '-'),
          }

          let childrens = tree(item.id) //get childrens from this source
          childrens.length ? source.children = childrens : false;

          response.push(source)
        }
      })
      return response
    }
    return tree()
  }

  /**
   * Order array in object for select
   *
   * @dataArray{object} = [{
    *   id: type int or string, -> require
    *   title: type string      -> require or full_name
    *   full_name: type string  -> require or title
    * }]
   *
   */
  select(dataArray) {
    let response = []
    dataArray.forEach((item) => {
      let itemId = item.id ? item.id : 0
      let labelTitle = item.title ? item.title :
        (item.name ? item.name : (item['fullName'] ? item['fullName'] : 'default'))

      response.push({
        label: labelTitle,
        value: itemId
      });
    })

    return response
  }

  /**
   * Return all parents of id in array
   *
   * @dataArray{object} = [{
    *   id: type int or string, -> require
    *   title: type string      -> require
    *   parentId: type string  -> require
    * }]
   * @id{int} = 1
   *
   * @Return{object} = {
    *   name : type String    / 'parent > parent > parent' return all parents and children element
    *   parents: type String  / 'parent > parent > parent' return only parents
    *   name: type String     / [1,2,3] return ID parents and children element
    * }
   *
   */
  parents(dataArray, id) {
    id = parseInt(id)

    let response = {name: [], id: []}

    if (dataArray) {
      while (id >= 1) {
        let parent = dataArray.find(item => item.id === id)
        if (parent) {
          response.name.unshift(parent.title)
          response.id.unshift(parent.id)
          id = parseInt(parent.parentId)
        }
      }
    }

    response.parents = response.name.slice(0, response.name.length - 1).join(' > ')
    response.name = response.name.join(' > ')

    return response
  }

  /**
   * Return all ID children of id in array
   *
   * @dataArray{object} = [{
    *   id: type int or string, -> require
    *   parentId: type string  -> require
    * }]
   * @id{int} = 1
   *
   * @Return{array} = [1,2,3...] ID of all children
   *
   */
  children(dataArray, id, excludeParent, type) {
    /*recursive function*/
    let childrens = (parentId) => {
      let response = []
      
      //add to "response" the ID children of parentId
      dataArray.filter((item) => {
        if (item.parentId == parentId) {
          if (!type)
            response.push(item.id)
          else
            response.push(item)

          let children = childrens(item.id) //get children from this source


          children.length ? response.push(children) : false
        }
      })

      return response
    }

    /*return array merge with all children ID*/
    let data = [].concat.apply([], childrens(parseInt(id)))
    !excludeParent ? data.unshift(id) : false //Add ID from parameter
    return data
  }

  /* difference between two arrays */
  diff(arr1, arr2) {
    var diff = {};

    diff.arr1 = arr1.filter(function (value) {
      if (arr2.indexOf(value) === -1) {
        return value;
      }
    });

    diff.arr2 = arr2.filter(function (value) {
      if (arr1.indexOf(value) === -1) {
        return value;
      }
    });

    diff.concat = diff.arr1.concat(diff.arr2);

    return diff;
  };

  /* find into array by param*/
  findByTag(array, tag, value) {
    let response = false
    if (array && tag && value) {
      array.forEach((item) => {
        if (item[tag].toString() === value.toString()) {
          response = item
        }
      })
    }
    return response
  }
}

const array = new Array();

export default ({Vue}) => {

  Vue.prototype.$array = array;

}

export {array};
