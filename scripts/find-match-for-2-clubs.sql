SELECT DISTINCT p.id, p.first_name, p.last_name
FROM players p
JOIN player_seasons ps1 ON p.id = ps1.player_id
JOIN player_seasons ps2 ON p.id = ps2.player_id
JOIN clubs c1 ON ps1.club_id = c1.id
JOIN clubs c2 ON ps2.club_id = c2.id
WHERE c1.code = 'TEL'
AND c2.code = 'BAR';