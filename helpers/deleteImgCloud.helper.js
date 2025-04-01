const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

/**
 * Trích xuất public_id từ URL Cloudinary
 * @param {string} url - URL của hình ảnh Cloudinary
 * @returns {string|null} - public_id của hình ảnh hoặc null nếu không tìm thấy
 */
const getPublicIdFromUrl = (url) => {
    try {
        // Ví dụ URL: http://res.cloudinary.com/drvlecsb/image/upload/v1743498018/qatim5pazgagcqrnlqvu.jpg
        if (!url || !url.includes("cloudinary.com")) {
            return null;
        }

        // Tách URL để lấy phần path
        const urlParts = url.split("/");

        // Lấy phần upload trong URL
        const uploadIndex = urlParts.findIndex((part) => part === "upload");

        if (uploadIndex === -1) {
            return null;
        }

        // Lấy phần sau version number (vXXXXXX)
        // Format thường là: .../upload/v1234567890/public_id.jpg
        const versionPart = urlParts[uploadIndex + 1];

        // Kiểm tra xem phần sau upload có phải là phiên bản không
        if (!versionPart || !versionPart.startsWith("v")) {
            return null;
        }

        // Lấy phần cuối của URL (public_id.extension)
        const filenamePart = urlParts[urlParts.length - 1];

        // Loại bỏ phần extension
        const filename = filenamePart.split(".")[0];

        // Kết quả final public_id (không bao gồm version và không có extension)
        return filename;
    } catch (error) {
        console.error(`Error extracting public_id from URL: ${error.message}`);
        return null;
    }
};

/**
 * Xóa danh sách hình ảnh từ Cloudinary theo URLs
 * @param {Array<string>} list - Danh sách URLs của các hình ảnh cần xóa
 * @returns {Promise<{success: boolean, message: string, results: Array<{url: string, success: boolean, error?: string}>}>} - Kết quả xóa
 */
const deleteImgCloud = async (list) => {
    if (!Array.isArray(list) || list.length === 0) {
        return {
            success: false,
            message: "Invalid or empty image list",
            results: [],
        };
    }

    const results = await Promise.all(
        list.map(async (url) => {
            try {
                const publicId = getPublicIdFromUrl(url);

                if (!publicId) {
                    return {
                        url,
                        success: false,
                        error: "Could not extract public_id from URL",
                    };
                }

                // Xóa hình ảnh từ Cloudinary
                const result = await cloudinary.uploader.destroy(publicId);

                if (result.result === "ok" || result.result === "not found") {
                    return {
                        url,
                        success: true,
                        publicId,
                    };
                } else {
                    return {
                        url,
                        success: false,
                        error: `Cloudinary returned: ${result.result}`,
                        publicId,
                    };
                }
            } catch (error) {
                return {
                    url,
                    success: false,
                    error: error.message,
                };
            }
        })
    );

    const successCount = results.filter((result) => result.success).length;

    return {
        success: successCount > 0,
        message: `Successfully deleted ${successCount}/${list.length} images`,
        results,
    };
};

module.exports = {
    deleteImgCloud,
    getPublicIdFromUrl,
};
