import request from '@/utils/request'

// 获取文章列表
export const getArticles = params => {
    return request({
        method: 'GET',
        url: `/mp/v1_0/articles`,
        params
    })
}
/**
 * 内容管理请求模块
 * 获取频道列表
*/
export const getArticleChannels = () => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/channels'
    })
}
/**
 * 删除文章模块
*/
export const deleteArticle = articleId => {
    return request({
        method: 'DELETE',
        url: `/mp/v1_0/articles/${articleId}`
    })
}
/**
 * 发布文章模块 
 */
export const addArticle = (data, draft = false) => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/articles',
        params: {
            draft
        },
        data
    })
}
/**
 * 获取文章
 */
export const updateArticle = (articleId, data, draft = false) => {
    return request({
        method: 'PUT',
        url: `/mp/v1_0/articles/${articleId}`,
        params: { draft },
        data
    })
}
/**
 * 获取制定文章
 */
export const getArticle = articleId => {
    return request({
        method: 'GET',
        url: `/mp/v1_0/articles/${articleId}`,
    })
}
/**
 * 获取用户素材
 */
export const getImages = params => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/user/images',
        params
    })
}
/**
 * 收藏图片
 */
export const collectImages = (imageId, collect) => {
    return request({
        method: 'PUT',
        url: `/mp/v1_0/user/images/${imageId}`,
        data: {
            collect
        }

    })
}

/**
 * 删除图片
 */

export const deleteImages = imageId => {
    return request({
        method: 'DELETE',
        url: `/mp/v1_0/user/images/${imageId}`,

    })
}
/**
 * 修改文章评论状态
 */
export const updateCommentStatus = (articleId, allowComment) => {
    return request({
        method: 'PUT',
        url: '/mp/v1_0/comments/status',
        params: {
            // 对象的属性名不受代码规范限制
            article_id: articleId
        },
        data: {
            allow_comment: allowComment
        }
    })
}
/**
 *  素材请求相关模块 上传图片素材
 */
export const uploadImage = data => {
    return request({
      method: 'POST',
      url: '/mp/v1_0/user/images',
      // 一般文件上传的接口都要求把请求头中的 Content-Type 设置为 multipart/form-data，但是我们使用 axios 上传文件的话不需要手动设置，你只要给 data 一个 FormData 对象即可。
      // new FormData()
      data
    })
  }
