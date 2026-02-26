import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iiwyuylfnxskjqnzgynd.supabase.co'; // හිස්තැන් ඉවත් කරන ලදී
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpd3l1eWxmbnhza2pxbnpneW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjQ1NDMsImV4cCI6MjA4NzcwMDU0M30.1_ywyumUtaMqT1751wmuskloIMEquCxpDCwNk2mMHpE";

const supabase = createClient(supabaseUrl, key);

export default function MediaUpload(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("Please select a file first");
            return;
        }
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${file.name.replace(/\s+/g, '_')}`; // ෆයිල් නමේ හිස්තැන් ඉවත් කිරීම
        
        supabase.storage.from('furniturevisualization').upload(fileName, file, { cacheControl: '3600', upsert: false })
            .then((response) => {
                if (response.error) {
                    reject("Error uploading file: " + response.error.message);
                } else {
                    const publicUrl = supabase.storage.from('furniturevisualization').getPublicUrl(fileName).data.publicUrl;
                    resolve(publicUrl);
                }
            })
            .catch((error) => {
                reject("Error uploading file: " + error.message);
            });
    });
}