

from django.http import JsonResponse, HttpResponse

from .cos import settings as cos_settings

from sts.sts import Sts

def get_cos_credential(request):
    """
    Get cos credential. 熬夜操他开始自己自动调音量的联系信息我
    By default, the duration is 30 min.
    ---
    Return: json format.
    See https://cloud.tencent.com/document/product/436/31923 
    for more detail.
    """
    config = {
        # 临时密钥有效时长，单位是秒
        'duration_seconds': 7200,
        'secret_id': cos_settings["secret_id"],
        # 固定密钥
        'secret_key': cos_settings["secret_key"],
        # 换成你的 bucket
        'bucket': cos_settings["bucket"],
        # 换成 bucket 所在地区
        'region': cos_settings["region"],
        # 例子： a.jpg 或者 a/* 或者 * (使用通配符*存在重大安全风险, 请谨慎评估使用)
        'allow_prefix': '*',
        # 密钥的权限列表。简单上传和分片需要以下的权限，其他权限列表请看 https://cloud.tencent.com/document/product/436/31923
        'allow_actions': [
            # 简单上传
            'name/cos:PutObject',
            'name/cos:PostObject',
            # 分片上传
            'name/cos:InitiateMultipartUpload',
            'name/cos:ListMultipartUploads',
            'name/cos:ListParts',
            'name/cos:UploadPart',
            'name/cos:CompleteMultipartUpload'
        ],
    }
    try:
        sts = Sts(config)
        response = sts.get_credential()
        # print('get data : ' + json.dumps(dict(response), indent=4))
        return JsonResponse(dict(response))
    except Exception as e:
        raise e
        return RESPONSE_UNKNOWN_ERROR