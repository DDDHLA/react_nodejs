// OCR服务工具类
export interface OCRResult {
  success: boolean;
  text: string;
  confidence?: number;
  words_result?: Array<{
    words: string;
    location?: {
      left: number;
      top: number;
      width: number;
      height: number;
    };
  }>;
  error?: string;
}

// 百度OCR服务
// 获取API Key步骤：
// 1. 访问 https://cloud.baidu.com/ 注册百度账号
// 2. 进入 https://ai.baidu.com/ 百度AI开放平台
// 3. 点击“控制台”→“文字识别”
// 4. 创建应用，获取API Key和Secret Key
export class BaiduOCRService {
  private static readonly API_KEY = "HZ41w4QGOJqkJqEBKkTawins"; // 替换为你的API Key
  private static readonly SECRET_KEY = "iCOkMQ0NbA1syHujNNcThOBtloVxssU5"; // 替换为你的Secret Key

  static async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(
        `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.API_KEY}&client_secret=${this.SECRET_KEY}`,
        { method: "POST" }
      );
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      throw new Error("获取百度OCR访问令牌失败");
    }
  }

  static async recognizeText(
    imageBase64: string,
    languageType: string = "CHN_ENG"
  ): Promise<OCRResult> {
    try {
      console.log("🚀 开始调用真实的百度OCR API...");

      // 方案1：使用Vite代理（开发环境）
      const isLocalDev =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const isCorrectPort = window.location.port === "8083";

      console.log("🔍 环境检测:", {
        hostname: window.location.hostname,
        port: window.location.port,
        isLocalDev,
        isCorrectPort,
        fullUrl: window.location.href,
      });

      if (isLocalDev && isCorrectPort) {
        console.log("🛠️ 使用Vite代理调用百度API");

        try {
          // 测试代理连接
          console.log("🔍 测试Vite代理连接...");

          // 获取access token
          const tokenUrl = `/baidu-api/oauth/2.0/token?grant_type=client_credentials&client_id=${this.API_KEY}&client_secret=${this.SECRET_KEY}`;
          console.log("🔗 Token URL:", tokenUrl);

          const tokenResponse = await fetch(tokenUrl, {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
          });

          console.log("📊 Token响应:", {
            status: tokenResponse.status,
            statusText: tokenResponse.statusText,
            headers: Object.fromEntries(tokenResponse.headers.entries()),
          });

          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error("❌ Token请求失败:", errorText);
            throw new Error(
              `获取token失败: ${tokenResponse.status} - ${errorText}`
            );
          }

          const tokenData = await tokenResponse.json();
          console.log("🔑 Token数据:", tokenData);

          const accessToken = tokenData.access_token;

          if (!accessToken) {
            throw new Error(
              `无法获取access_token: ${JSON.stringify(tokenData)}`
            );
          }

          console.log(
            "✅ 成功获取access_token:",
            accessToken.substring(0, 20) + "..."
          );

          // 调用OCR API
          const apiUrl = `/baidu-api/rest/2.0/ocr/v1/general_basic?access_token=${accessToken}`;
          console.log("🔗 OCR URL:", apiUrl);

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
            body: `image=${encodeURIComponent(
              imageBase64
            )}&language_type=${languageType}`,
          });

          console.log("📊 OCR响应:", {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ OCR请求失败:", errorText);
            throw new Error(
              `OCR API调用失败: ${response.status} - ${errorText}`
            );
          }

          const result = await response.json();
          console.log("🎉 百度OCR API调用成功！", result);

          if (result.words_result) {
            const text = result.words_result
              .map((item: { words: string }) => item.words)
              .join("\n");
            return {
              success: true,
              text,
              words_result: result.words_result,
            };
          } else {
            throw new Error(result.error_msg || "识别失败");
          }
        } catch (viteProxyError) {
          console.error("🚨 Vite代理失败:", viteProxyError);
          throw viteProxyError;
        }
      } else {
        console.log("⚠️ 不是正确的开发环境，跳过Vite代理");
        if (!isLocalDev) {
          console.log("ℹ️ 请使用 localhost:8083 访问应用");
        }
        if (!isCorrectPort) {
          console.log(`ℹ️ 当前端口: ${window.location.port}, 需要: 8083`);
        }
      }

      // 方案2：尝试外部CORS代理（生产环境）
      console.log("🌐 尝试外部CORS代理...");
      const corsProxies = [
        "https://api.allorigins.win/raw?url=",
        "https://corsproxy.io/?",
      ];

      for (const proxyUrl of corsProxies) {
        try {
          console.log(`尝试: ${proxyUrl}`);

          // 获取token
          const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.API_KEY}&client_secret=${this.SECRET_KEY}`;
          const tokenResponse = await fetch(proxyUrl + tokenUrl, {
            method: "POST",
          });
          const tokenData = await tokenResponse.json();
          const accessToken = tokenData.access_token;

          if (!accessToken) continue;

          // 调用OCR
          const apiUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${accessToken}`;
          const response = await fetch(proxyUrl + apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `image=${encodeURIComponent(
              imageBase64
            )}&language_type=${languageType}`,
          });

          if (response.ok) {
            const result = await response.json();
            console.log("🎉 CORS代理成功！", result);

            if (result.words_result) {
              const text = result.words_result
                .map((item: { words: string }) => item.words)
                .join("\n");
              return { success: true, text, words_result: result.words_result };
            }
          }
        } catch (error) {
          console.log(`${proxyUrl} 失败:`, error);
          continue;
        }
      }

      throw new Error("所有代理方案都失败");
    } catch (error) {
      console.error("❌ 所有OCR方案都失败:", error);

      return {
        success: false,
        text: "",
        error: `OCR调用失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
      };
    }
  }

  // 使用CORS代理获取访问令牌
  static async getAccessTokenWithProxy(): Promise<string> {
    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.API_KEY}&client_secret=${this.SECRET_KEY}`;

      const response = await fetch(proxyUrl + tokenUrl, {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const data = await response.json();
      console.log(data, "oooooooo");
      return data.access_token;
    } catch (error) {
      throw new Error("获取访问令牌失败");
    }
  }
}

// 腾讯云OCR服务
export class TencentOCRService {
  static async recognizeText(imageBase64: string): Promise<OCRResult> {
    // 这里需要实现腾讯云OCR的调用逻辑
    // 由于需要复杂的签名算法，建议通过后端代理
    return {
      success: false,
      text: "",
      error: "腾讯云OCR需要后端支持",
    };
  }
}

// Google Vision OCR服务
// 获取API Key步骤：
// 1. 访问 https://console.cloud.google.com/
// 2. 创建项目并启用Vision API
// 3. 在“凭据”中创建API密钥
export class GoogleVisionService {
  private static readonly API_KEY = "YOUR_GOOGLE_API_KEY"; // 替换为你的Google API Key

  static async recognizeText(imageBase64: string): Promise<OCRResult> {
    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: imageBase64,
                },
                features: [
                  {
                    type: "TEXT_DETECTION",
                  },
                ],
              },
            ],
          }),
        }
      );

      const result = await response.json();

      if (result.responses && result.responses[0].textAnnotations) {
        const text = result.responses[0].textAnnotations[0].description;
        return {
          success: true,
          text,
        };
      } else {
        throw new Error("Google Vision API识别失败");
      }
    } catch (error) {
      return {
        success: false,
        text: "",
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }
}

// OCR服务管理器
export class OCRServiceManager {
  static async recognizeText(
    imageBase64: string,
    service: "baidu" | "tencent" | "google" | "tesseract" = "baidu",
    language: string = "CHN_ENG"
  ): Promise<OCRResult> {
    switch (service) {
      case "baidu":
        return await BaiduOCRService.recognizeText(imageBase64, language);
      case "tencent":
        return await TencentOCRService.recognizeText(imageBase64);
      case "google":
        return await GoogleVisionService.recognizeText(imageBase64);
      case "tesseract":
        // Tesseract.js 在组件中直接调用
        return {
          success: false,
          text: "",
          error: "Tesseract需要在组件中调用",
        };
      default:
        return {
          success: false,
          text: "",
          error: "不支持的OCR服务",
        };
    }
  }
}

// 本地OCR优化配置
export const TesseractConfig = {
  // 中文识别优化
  chinese: {
    lang: "chi_sim+eng",
    options: {
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz一二三四五六七八九十百千万亿零壹贰叁肆伍陆柒捌玖拾佰仟萬億",
      tessedit_pageseg_mode: "6", // 单一文本块
      preserve_interword_spaces: "1",
    },
  },
  // 英文识别优化
  english: {
    lang: "eng",
    options: {
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,!?;:",
      tessedit_pageseg_mode: "6",
      preserve_interword_spaces: "1",
    },
  },
  // 数字识别优化
  numbers: {
    lang: "eng",
    options: {
      tessedit_char_whitelist: "0123456789.,+-=()[]{}",
      tessedit_pageseg_mode: "8", // 单词识别
    },
  },
};
