import os
import re
import zipfile

def read_index_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    return content

def write_html_file(content, ad_type, gg_url, file_name,zip_name):
    try:
        replaced_content = content.replace(
            'window["AD_TYPE"]=""',
            f'window["AD_TYPE"]="{ad_type}"')

        if ad_type == "UNITY":
            replaced_content = replaced_content.replace(
                'window["GGURL"]=""',
                f'window["GGURL"]="{gg_url}";\nfunction u_a(){{mraid.open()}};')
        else:
            replaced_content = replaced_content.replace(
                'window["GGURL"]=""',
                f'window["GGURL"]="{gg_url}";')

        if replaced_content:
            with open(file_name, 'w', encoding='utf-8') as file:
                file.write(replaced_content)
                print(f"文件{file_name}已成功生成。")

                if ad_type == 'MTG' or ad_type == "KWAI":
                    with zipfile.ZipFile(zip_name,'w') as zipf:
                        zipf.write(file_name)
                os.remove(file_name)
        else:
            print('内容替换失败。')

    except Exception as e:
        print(f"异常:{e}")

if __name__ == "__main__":
    file_path = '../build/index.html'
    content = read_index_html(file_path)

    gg_url = input("请输入输出的链接:")
    pack_name = input("请输入打包名字")
    ad_types = ["UNITY", "MTG", "KWAI", "APPLOVIN", "IRONSOURCES"]
    ad_arr = ["Unity", "Mintegral", "Kwai", "AppLovin", "ironSource"]
    folder_Arr = ["Unity", "Mintegral", "Kwai", "AppLovin", "ironSource"]
    zip_name = ''

    for idx, ad_type in enumerate(ad_types):
        os.mkdir(folder_Arr[idx])
        file_name = f"{pack_name}_{ad_arr[idx]}.html"
        if ad_type == "MTG":
            file_name = f"{pack_name}__xsm__{ad_arr[idx]}.html"
            zip_name = f"{pack_name}__xsm__{ad_arr[idx]}.zip"
        if ad_type == "KWAI":
            zip_name = f"{pack_name}_{ad_arr[idx]}.zip"
        write_html_file(content, ad_type, gg_url, file_name,zip_name)

    print("所有文件已生成并已打包成压缩包！")