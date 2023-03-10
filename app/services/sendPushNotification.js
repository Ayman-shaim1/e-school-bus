export default async function sendPushNotification(token, title, body, idUser) {
  const message = {
    to: token,
    title: title,
    body: body,
    sound: "default",
    data: { idUser: idUser },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
