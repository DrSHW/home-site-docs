---
description: Docs intro
layout: ../../layouts/MainLayout.astro
---

# 通过CSRF中间件验证

在前后端不分离的模式下，在需要发出`POST`等类型的请求的表单上方添加`{% csrf_token %}`字段即可。

而在前后端分离的情况下，首先要保证前后端**同源**，因为非同源的站点间无法设置Cookie，也就必定无法通过CSRF验证。

其次要处理好跨域，详见：[Django处理跨域](https://docs.drshw.tech/sf/2/2/#%E6%B7%BB%E5%8A%A0%E7%99%BD%E5%90%8D%E5%8D%95)。

处理好跨域后，前端需要先向后端请求`token`的值，流程如下：

<img src="https://images.drshw.tech/images/notes/image-20221204214005833.png" alt="image-20221204214005833" style="zoom: 50%;" />

其中，后端的`get_token()`函数在`django.middleware.csrf`包中；响应数据即为`csrf token`，且响应头中会包括`Set-Cookie`字段，在将在前端设置Cookie凭证信息。

在接下来前端发送的`POST`等请求中，需要携带该Cookie，且请求头中应当包含`csrf token`，请求头名称与`settings.py`中设置的应当一致。

`settings.py`中的设置说明：

```python
CSRF_TRUSTED_ORIGINS = [	# 配置可通过验证的域名
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
]

CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN'	# 对应验证请求头为X_CSRFTOKEN，HTTP_为必加的前缀

CSRF_COOKIE_NAME = 'csrftoken'	# 对应cookie中csrf token的键名
```

验证通过的示例：

后端配置：

```python
# 路由
path('getToken/', views.getCsrftoken),

# 视图
def getCsrftoken(request):
    token = get_token(request)
    response = JsonResponse({'csrf_token': token})
    return response
```

前端使用`axios`请求，获取`token`值：

```typescript
import axios from "axios";

axios.defaults.withCredentials = true	// 一定要配置，否则无法传递Cookie请求头

const base_url = "http://127.0.0.1:8000/"

const base_api = axios.create({
  baseURL: base_url,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
})

const getCookie = function(cookie: string){		// 提取Cookie字段
  let reg: any = /csrftoken=([\w]+)[;]?/g
  return reg.exec(cookie)[1]
}

// 创建拦截器，当请求为POST/PUT/DELETE时，添加X-CSRFToken
base_api.interceptors.request.use(
  (config: any) => {
    let token = document.cookie;
    if (token && config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      config.headers['X-CSRFToken'] = getCookie(token)	// 将token放入请求头，请求头名与配置项一致
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export const get_csrf_token = () => {
  return base_api.get('/getToken/')
}
```

由于有拦截器，将自动在发送`POST`等请求时加上请求头，这样就能通过认证了。