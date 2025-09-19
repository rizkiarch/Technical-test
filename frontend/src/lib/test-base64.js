// Test file untuk demonstrasi base64 encoding untuk animal ID
console.log('=== Base64 Encoding Test ===');

// ID yang bermasalah dengan slash
const animalId = "250919/Anjing/003";
console.log('Original ID:', animalId);

// Encode menggunakan base64
const encodedId = btoa(animalId);
console.log('Base64 Encoded:', encodedId);

// Decode kembali
const decodedId = atob(encodedId);
console.log('Decoded back:', decodedId);

// Verify
console.log('Is same?', animalId === decodedId);

console.log('\n=== URL Examples ===');
console.log('With URL encoding:', `http://localhost:8080/api/animals/${encodeURIComponent(animalId)}/checkout`);
console.log('With Base64 encoding:', `http://localhost:8080/api/animals/${encodedId}/checkout`);

console.log('\n=== Results ===');
console.log('URL Encoded:', encodeURIComponent(animalId)); // 250919%2FAnjing%2F003
console.log('Base64 Encoded:', encodedId); // MjUwOTE5L0FuamluZy8wMDM=