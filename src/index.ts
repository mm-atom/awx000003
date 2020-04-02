import global from '@mmstudio/global';

/**
 * 调用服务
 * @param service_name 服务类型
 * @param msg 参数
 */
export default async function nodejs<T extends object>(service_name: string, msg: unknown) {
	const url = `${global('host', 'http://127.0.0.1:8889')}/sendmessage/${encodeURIComponent(service_name)}`;
	const data = JSON.stringify({
		msg,
		type: service_name
	});
	return post<T>(url, data);
}

function post<T extends object>(url: string, data: string | object | ArrayBuffer, headers?: { [key: string]: string; }) {
	const header = {
		cookie: wx.getStorageSync('cookie'),
		...headers
	};
	return new Promise<T>((resolve, reject) => {
		wx.request({
			data,
			header,
			method: 'POST',
			url,
			success(res) {
				const cookie = res.header['Set-Cookie'];
				if (cookie) {
					wx.setStorageSync('cookie', res.header['Set-Cookie']);
				}
				if (res.statusCode > 0 && res.statusCode < 400) {
					resolve(res.data as T);
				} else {
					reject(res);
				}
			},
			fail(res) {
				reject({ data: { msg: res.errMsg, detail: res.errMsg } });
			}
		});
	});
}
