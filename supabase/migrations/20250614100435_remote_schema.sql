create policy "Policy with security definer functions"
on "public"."game_records"
as permissive
for all
to public
using (true);


create policy "Policy with security definer functions"
on "public"."shogi_moves_statistics"
as permissive
for all
to public
using (true);



