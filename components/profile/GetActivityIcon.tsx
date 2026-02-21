import Icon from "./Icons";

const getActivityIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('order')) return <Icon.Package className="h-3.5 w-3.5" />;
  if (t.includes('wishlist')) return <Icon.Heart className="h-3.5 w-3.5" />;
  if (t.includes('password') || t.includes('security')) return <Icon.Shield className="h-3.5 w-3.5" />;
  if (t.includes('address')) return <Icon.MapPin className="h-3.5 w-3.5" />;
  return <Icon.User className="h-3.5 w-3.5" />;
}; 

export default getActivityIcon