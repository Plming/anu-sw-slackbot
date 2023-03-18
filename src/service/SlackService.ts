import axios, { AxiosRequestHeaders } from "axios";

import { Business, getBusinessUrl } from "../entity/business";
import { Notice, getNoticeUrl } from "../entity/notice";

function init() {
    if (process.env.SLACK_WEBHOOK_URL === undefined) {
        throw new Error("슬랙 웹훅 URL이 설정되어 있지 않습니다.");
    }
}
init();

const headers = {
    "Content-Type": "application/json"
}

export async function notifyBusinessAdded(business: Business) {
    const payload = {
        "text": `📄 ${business.title}`,
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": `📄 ${business.title}`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*신청기한:* ${business.applicationEndDate.toLocaleDateString('ko-kr')}\n*지원부서:* ${business.department}`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "신청하기"
                    },
                    "style": "primary",
                    "action_id": "button-action",
                    "url": getBusinessUrl(business._id)
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": business.bodyText
                }
            }
        ]
    }

    await axios.post(process.env.SLACK_WEBHOOK_URL, payload, { headers: headers });
    console.log(`슬랙방에 게시 완료 - 지원사업: ${business.title}`);
}

export async function notifyNoticeAdded(notice: Notice) {
    const payload = {
        "text": `📢 ${notice.title}`,
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": `📢 ${notice.title}`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*지원부서:* ${notice.author}`
                },
                "accessory": {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "확인하기"
                    },
                    "style": "primary",
                    "action_id": "button-action",
                    "url": getNoticeUrl(notice._id)
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "plain_text",
                    "text": notice.bodyText
                }
            }
        ]
    }

    await axios.post(process.env.SLACK_WEBHOOK_URL, payload, { headers: headers });
    console.log(`슬랙방에 게시 완료 - 공지사항: ${notice.title}`);
}
