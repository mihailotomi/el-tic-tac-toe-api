SELECT DISTINCT p.first_name, p.last_name
FROM players p
JOIN player_seasons ps ON p.id = ps.player_id
JOIN clubs c ON ps.club_id = c.id
WHERE c.code = 'OLY'
AND p.country = 'ESP';